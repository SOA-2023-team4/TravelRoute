# frozen_string_literal: true

require 'dry/transaction'

module TravelRoute
  module Service
    # Retrieves array of all listed attraction entities
    class GeneratePlan
      include Dry::Transaction

      step :validate_input
      step :make_entity
      step :get_plan
      step :reify_plan

      private

      def validate_input(input)
        if input[:request].success?
          Success(input.merge(**input[:request].to_h).except(:request))
        else
          Failure(input.errors.values.join('; '))
        end
      end

      def make_entity(input)
        attractions = ListAttractions.new.call(cart: input[:cart]).value!
        Success(attractions:, **input)
      end

      def get_plan(input)
        plan = Gateway::Api.new(App.config).get_plan(**input)

        Success(plan)
      rescue StandardError
        Failure('Could not generate guidebook')
      end

      def reify_plan(results)
        plan = Representer::Plan.new(OpenStruct.new).from_json(results.payload)
        Success(plan)
      rescue StandardError
        Failure('Error in parsing Attraction')
      end
    end
  end
end
