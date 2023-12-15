# frozen_string_literal: true

require 'dry-validation'

module TravelRoute
  module Forms
    # Form validation for selected attraction
    class GeneratePlan < Dry::Validation::Contract
      params do
        required(:origin).filled(:string)
      end

      rules do
        key.failure('Orgin should be set') if value[:origin].empty?
      end
    end
  end
end
