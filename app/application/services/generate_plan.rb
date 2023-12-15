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
        if input[:origin].success?
          origin = input[:origin][:origin]
          Success(input.merge(origin:))
        else
          Failure(input.errors.values.join('; '))
        end
      end

      def make_entity(input)
        cart = ListAttractions.new.call(cart: input[:cart]).value!
        origin = cart.find { |attraction| attraction.place_id == input[:origin] }
        Success(cart:, origin:)
      end

      def get_plan(input)
        plan = Gateway::Api.new(App.config).get_plan(origin: input[:origin], attractions: input[:cart])

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
