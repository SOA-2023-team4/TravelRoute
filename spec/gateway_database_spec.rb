# frozen_string_literal: false

require_relative 'spec_helper'
require_relative 'helpers/vcr_helper'
require_relative 'helpers/database_helper'

describe 'Integration Tests of Google Maps API and Database' do
  VcrHelper.setup_vcr

  before do
    VcrHelper.configure_vcr_for_gmap
  end

  after do
    VcrHelper.eject_vcr
  end

  describe 'Retrieve and store project' do
    before do
      DatabaseHelper.wipe_database
    end

    it 'HAPPY: should be able to save places from Google Maps to database' do
      places = TravelRoute::PlaceMapper
        .new(GMAP_TOKEN)
        .find(PLACE)
      place = places[0]
      rebuilt = TravelRoute::Repository::Places.create(place)

      _(rebuilt.place_id).must_equal(place.place_id)
      _(rebuilt.name).must_equal(place.name)
      _(rebuilt.address).must_equal(place.address)
    end
  end
end
