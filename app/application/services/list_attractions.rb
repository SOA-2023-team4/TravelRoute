# frozen_string_literal: true

require 'dry/monads'

module TravelRoute
  module Service
    # Retrieves array of all listed attraction entities
    class ListAttractions
      include Dry::Transaction

      step :lookup_call
      step :reify_attractions

      def lookup_call(input)
        place_ids = input[:cart].keys
        response_list = place_ids.map do |place_id|
          result = Gateway::Api.new(TravelRoute::App.config).add_attraction(place_id)
          result.success? ? Success(result.payload) : Failure(result.message)
        end
        unpack(response_list)
      rescue StandardError
        Failure('Could not connect to Travel Route API or place_id doesnt exist')
      end

      def reify_attractions(results)
        attractions = results.map do |attraction_json|
          Representer::Attraction.new(OpenStruct.new).from_json(attraction_json)
        end
        Success(attractions)
      rescue StandardError
        Failure('Error in parsing Attraction')
      end

      # helper methods
      def unpack(list_of_response)
        return Failure(list_of_response.map(&:failure?).map(&:value!)) unless list_of_response.map(&:success?).all?

        Success(list_of_response.map(&:value!))
      end
    end
  end
end
