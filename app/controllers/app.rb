# frozen_string_literal: true

require 'roda'
require 'slim'

# The core class of the web app for TravelRoute
module TravelRoute
  # Web App
  class App < Roda
    plugin :render, engine: 'slim', views: 'app/views'
    plugin :assets, css: 'style.css', path: 'app/views/assets'
    plugin :assets, path: 'app/views/assets', group_subdirs: false,
                    js: {
                      home: ['home.js'],
                      plan: ['plan.js']
                    }
    plugin :common_logger, $stderr
    plugin :halt

    route do |routing|
      routing.assets
      response['Content-Type'] = 'text/html; charset=utf-8'

      # GET /
      routing.root do
        view 'home'
      end

      routing.on 'plan' do
        routing.is do
          # POST /plan
          routing.post do
            places = routing.params['places']
            routing.halt 400, 'destinations is required' if places.nil? || places.empty?

            destinations = CGI.escape(places.join(','))
            routing.redirect "/plan?places=#{destinations}"
          end

          # GET /plan?places=<destinations>
          routing.get do
            routing.redirect '/' if routing.params.empty?

            places = routing.params['places'].split(',')
              .map { |place| PlaceMapper.new(App.config.GMAP_TOKEN).find(place).first }
            routing.halt 400, 'at least two valid places are required' if places.nil? || places.size < 2

            origin = places.first
            waypoints = WaypointMapper.new(App.config.GMAP_TOKEN).waypoints(places)
            routes = waypoints.travel_plan_from(origin)

            view 'plan', locals: { routes:, origin: }
          end
        end
      end
    end
  end
end
