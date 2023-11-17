# frozen_string_literal: true

require 'dry-types'
require 'dry-struct'

module TravelRoute
  module Entity
    # Data structure for place information
    class Attraction < Dry::Struct
      include Dry.Types

      attribute :place_id,        Strict::String
      attribute :name,            Strict::String
      attribute :address,         Strict::String
      attribute? :opening_hours,  Strict::Hash.optional
      attribute :rating,          Coercible::Float.optional

      def to_attr_hash
        to_hash.except(:opening_hours)
      end
    end
  end
end
