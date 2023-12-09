# frozen_string_literal: true

require 'roda'
require 'slim'
require 'slim/include'

# The core class of the web app for TravelRoute
module TravelRoute
  # Web App
  class App < Roda # rubocop:disable Metrics/ClassLength
    plugin :halt
    plugin :flash
    plugin :all_verbs
    plugin :render, engine: 'slim', views: 'app/presentation/views_html'
    plugin :assets, path: 'app/presentation/assets', group_subdirs: false,
                    css: 'style.css',
                    js: {
                      home: ['home.js'],
                      plan: ['plan.js']
                    }
    plugin :common_logger, $stderr

    # use Rack::MethodOverride

    route do |routing|
      routing.assets
      response['Content-Type'] = 'text/html; charset=utf-8'

      # GET /
      routing.root do
        session[:cart] ||= []
        session[:saved] ||= {}
        list_result = Service::ListAttractions.new.call(session[:cart])

        if list_result.failure?
          flash[:error] = list_result.failure
          cart_item = []
        else
          carted_attractions = list_result.value!
          cart_item = Views::AttractionList.new(carted_attractions).attractions
        end

        view 'home', locals: { cart: cart_item }
      end

      routing.on 'search' do
        # POST /search
        routing.is do
          routing.post do
            req = JSON.parse(routing.body.read, symbolize_names: true)
            search_req = Forms::SearchAttraction.new.call(req)
            search_result = Service::SearchAttractions.new.call(search_req)
            if search_result.failure?
              flash[:error] = search_result.failure
              routing.halt 500
            end
            searched_attraction = search_result.value!
            Views::AttractionList.new(searched_attraction).to_json
          end
        end
      end

      routing.on 'attractions' do
        routing.is do
          # POST /attractions
          routing.post do
            req = JSON.parse(routing.body.read)
            val_req = Forms::NewAttraction.new.call(req)

            if val_req.failure?
              flash[:error] = val_req.errors.messages.join('; ')
              routing.halt 400
            end

            selected = JSON.parse(val_req['selected'], symbolize_names: true)
            add_result = Service::AddAttraction.new.call(selected)

            if add_result.failure?
              flash[:error] = add_result.failure
              routing.halt 500
            end

            selected_attraction = add_result.value!
            session[:cart].push(selected_attraction.place_id).uniq!

            Views::Attraction.new(selected_attraction).to_json
          end

          # DELETE /attractions
          routing.delete do
            req = JSON.parse(routing.body.read, symbolize_names: true)
            removed = req[:removed]
            removed == 'all' ? session[:cart].clear : session[:cart].delete(removed)
            { removed: }.to_json
          end
        end
      end

      routing.on 'adjustment' do
        routing.is do
          # GET /adjustment
          routing.get do
            req = Service::ListAttractions.new.call(session[:cart])

            if req.failure?
              flash[:error] = req.failure
              routing.redirect '/plans'
            end

            cart = req.value!
            cart_item = Views::AttractionList.new(cart).attractions
            view 'adjustment', locals: { cart: cart_item }
          end
        end
      end

      routing.on 'plans' do
        # GET /plans/:plan_name
        routing.on String do |plan_name|
          routing.get do
            plan = session[:saved][plan_name]
            view 'plan', locals: { plan: }
          end
        end

        routing.is do
          # GET /plans
          routing.get do
            origin_id = routing.params['origin']
            place_ids = session[:cart]
            plan_req = Service::GeneratePlan.new.call(cart: place_ids, origin: origin_id)

            if plan_req.failure?
              flash[:error] = plan_req.failure
              routing.redirect "/plans?origin=#{origin_id}"
            end

            plan = Views::Plan.new(plan_req.value!)
            session[:temp_plan] = plan
            view 'plan', locals: { plan: }
          end

          # POST /plans
          routing.post do
            plan = session[:temp_plan].plan
            save_req = Forms::SavePlan.new.call(routing.params)

            if save_req.failure?
              flash[:error] = save_req.errors.messages.join('; ')
              routing.redirect '/plans'
            end

            plan_name = save_req[:plan_name]
            saved = plan_name.nil? ? Views::Plan.new(plan) : Views::Plan.new(plan, plan_name)
            session[:saved].merge!(saved.name => saved)
            flash[:notice] = 'Plan saved'
            routing.redirect "/plans?origin=#{saved.origin.place_id}"
          end

          # DELETE /plans
          routing.delete do
            req = JSON.parse(routing.body.read, symbolize_names: true)
            del_req = Forms::DeletePlan.new.call(req)

            if del_req.failure?
              flash[:error] = del_req.errors.messages.join('; ')
              routing.redirect '/plans'
            end

            deleted = del_req[:plan_name]
            session[:saved].delete(deleted)
            { success: true }.to_json
          end
        end
      end
    end
  end
end
