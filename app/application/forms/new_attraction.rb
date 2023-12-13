# frozen_string_literal: true

require 'dry-validation'

module TravelRoute
  module Forms
    # Form validation for selected attraction
    class NewAttraction < Dry::Validation::Contract
      params do
        required(:selected_attraction).filled(:string)
      end

      rules do
        key.failure('No attraction selected') if value[:selected_attraction].empty?
      end
    end
  end
end
