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
                      utils: ['utils.js'],
                      home: ['home.js'],
                      plan: ['plan.js'],
                      map: ['map.js']
                    }
    plugin :request_headers
    plugin :common_logger, $stderr

    # use Rack::MethodOverride

    route do |routing|
      routing.assets
      response['Content-Type'] = 'text/html; charset=utf-8'
      session[:key] = App.config.GMAP_TOKEN

      # GET /
      routing.root do
        session[:cart] ||= {}
        list_result = Service::ListAttractions.new.call(cart: session[:cart])

        if list_result.failure?
          flash[:error] = list_result.failure
          cart_item = []
        else
          carted_attractions = list_result.value!
          cart_item = Views::AttractionList.new(carted_attractions).attractions
        end

        view 'home', locals: { cart: cart_item }
      end

      routing.on 'carts' do
        response['Content-Type'] = 'application/json'
        # GET /carts/:place_id
        routing.on String do |place_id|
          routing.get do
            session[:cart] ||= {}
            val_req = Forms::NewAttraction.new.call(selected_attraction: place_id)
            add_result = Service::AddAttraction.new.call(val_req)
            if add_result.failure?
              flash[:error] = add_result.failure
              routing.halt 500
            end
            attraction = add_result.value!
            attraction_view = Views::Attraction.new(attraction)
            session[:cart].merge!(attraction_view.to_map_pin)
            attraction_view.to_json
          end

          # DELETE /carts/:place_id
          routing.delete do
            removed = session[:cart].delete(place_id.to_sym)
            removed.to_json
          end
        end

        routing.is do
          # GET /carts or /carts?format=pins
          routing.get do
            session[:cart] ||= {}
            return session[:cart].values.to_json if routing.params['format'] == 'pins'

            session[:cart].keys.to_json
          end
        end
      end

      routing.on 'attractions' do
        response['Content-Type'] = 'application/json'
        routing.is do
          # Get /attractions?search_term=
          routing.get do
            search_req = Forms::SearchAttraction.new.call(routing.params)
            search_result = Service::SearchAttractions.new.call(search_req)
            if search_result.failure?
              flash[:error] = search_result.failure
              routing.halt 500
            end

            Views::AttractionList.new(search_result.value!.attractions).to_json
          end
        end
      end

      # routing.on 'adjustment' do
      #   routing.is do
      #     # GET /adjustment
      #     routing.get do
      #       req = Service::ListAttractions.new.call(session[:cart])

      #       if req.failure?
      #         flash[:error] = req.failure
      #         routing.redirect '/plans'
      #       end
      #       cart = req.value!
      #       cart_item = Views::AttractionList.new(cart).attractions
      #       view 'adjustment', locals: { cart: cart_item }
      #     end
      #   end
      # end

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
