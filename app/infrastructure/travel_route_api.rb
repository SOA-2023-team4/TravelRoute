# frozen_string_literal: true

require 'http'

module TravelRoute
  module Gateway
    # Infrastructure to connect with TravelRoute API
    class Api
      def initialize(config)
        @config = config
        @request = Request.new(config)
      end

      def alive?
        @request.healthcheck.success?
      end

      def search_attractions(search_term)
        @request.search(search_term)
      end

      # HTTP Request
      class Request
        API_ROOT_ENDPOINT = '/api/v1'

        def initialize(config)
          @api_host = config.API_HOST
          @api_root = @api_host + API_ROOT_ENDPOINT
        end

        def healthcheck
          get
        end

        def search(search_term)
          params = { search: CGI.escape(search_term) }
          get(['search'], params:)
        end

        def add_attraction(body)
          post(['attractions'], body:)
        end

        private

        def get(path = [], params: {})
          api_endpoint = path.empty? ? @api_host : @api_root
          url = api_endpoint + path.join('/')
          HTTP.headers('Content-Type' => 'application/json')
            .get(url, params:)
            .then { |response| Response.new(response) }
        rescue StandardError
          raise "Invalid request to #{url}"
        end

        def post(path = [], body: {}, params: {})
          api_endpoint = path.empty? ? @api_host : @api_root
          url = api_endpoint + path.join('/')
          HTTP.headers('Content-Type' => 'application/json')
            .post(url, params:, json: body)
            .then { |response| Response.new(response) }
        rescue StandardError
          raise "Invalid request to #{url}"
        end
      end

      # HTTP Response
      class Response < SimpleDelegator
        NotFound = Class.new(StandardError)

        SUCCESS_CODE = (200..299)

        def success?
          code.between?(SUCCESS_CODE.first, SUCCESS_CODE.last)
        end

        def message
          payload['message']
        end

        def payload
          payload.to_s
        end
      end
    end
  end
end
