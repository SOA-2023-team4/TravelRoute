# frozen_string_literal: true

require 'dry/transaction'

module TravelRoute
  module Service
    # Retrieves array of all listed attraction entities
    class AddAttraction
      include Dry::Transaction

      step :validate_input
      step :select_attraction
      step :reify_attraction

      private

      def validate_input(input)
        if input.success?
          attraction = JSON.parse(input[:selected_attraction])
          place_id = attraction['place_id']
          Success(place_id:)
        else
          Failure("Form input failure #{input.errors.values.join('; ')}")
        end
      end

      def select_attraction(input)
        result = Gateway::Api.new(TravelRoute::App.config).add_attraction(input[:place_id])
        result.success? ? Success(result.payload) : Failure(result.message)
      rescue StandardError
        Failure('Could not connect to Travel Route API or place_id doesnt exist')
      end

      def reify_attraction(attraction_json)
        Representer::Attraction.new(OpenStruct.new)
          .from_json(attraction_json)
          .then { |attraction| Success(attraction) }
      rescue StandardError
        Failure('Error in Attraction')
      end
    end
  end
end
