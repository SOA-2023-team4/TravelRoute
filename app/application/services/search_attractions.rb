# frozen_string_literal: true

require 'dry/monads'

module TravelRoute
  module Service
    # Retrieves array of all listed attraction entities
    class SearchAttractions
      include Dry::Transaction

      step :validate_input
      step :search_call
      step :reify_attraction

      private

      def validate_input(input)
        if input.success?
          search_term = input[:search_term]
          Success(search_term:)
        else
          Failure(input.errors.values.join('; '))
        end
      end

      def search_call(input)
        result = Gateway::Api.new(TravelRoute::App.config).search_attractions(input[:search_term])
        result.success? ? Success(result.payload) : Failure(result.message)
      rescue StandardError
        Failure('Could not connect to Travel Route API')
      end

      def reify_attraction(attractions_json)
        Representer::AttractionsList.new(OpenStruct.new).from_json(attractions_json)
          .then { |attraction| Success(attraction) }
      rescue StandardError
        Failure('Error in Attraction')
      end
    end
  end
end
