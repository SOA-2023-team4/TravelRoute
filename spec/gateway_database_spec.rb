# frozen_string_literal: false

require_relative 'helpers/spec_helper'
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

  describe 'Retrieve and store attraction information' do
    before do
      DatabaseHelper.wipe_database
    end

    it 'HAPPY: should be able to save attraction information from Google Maps to database' do
      places = TravelRoute::Mapper::AttractionMapper
        .new(GMAP_TOKEN)
        .find(PLACE)
      place = places[0]
      rebuilt = TravelRoute::Repository::Attractions.update_or_create(place)

      _(rebuilt.place_id).must_equal(place.place_id)
      _(rebuilt.name).must_equal(place.name)
      _(rebuilt.address).must_equal(place.address)
    end

    it 'HAPPY: should be able to update attraction information' do
      bigcity = TravelRoute::Mapper::AttractionMapper.new(GMAP_TOKEN).find_by_id(BIGCITY_PLACE_ID)
      original = TravelRoute::Repository::Attractions.update_or_create(bigcity)
      _(original.name).must_equal(bigcity.name)
      _(original.address).must_equal(bigcity.address)
      _(original.rating).must_equal(bigcity.rating)

      changed = TravelRoute::Entity::Attraction.new(
        place_id: original.place_id,
        name: 'Big City (updated)',
        address: '(new) Big City, Big Country',
        rating: 100.0,
        opening_hours: original.opening_hours
      )
      rebuilt = TravelRoute::Repository::Attractions.update_or_create(changed)
      _(rebuilt.place_id).must_equal(original.place_id)
      _(rebuilt.name).wont_equal(original.name)
      _(rebuilt.address).wont_equal(original.address)
      _(rebuilt.rating).wont_equal(original.rating)

      _(rebuilt.place_id).must_equal(changed.place_id)
      _(rebuilt.name).must_equal(changed.name)
      _(rebuilt.address).must_equal(changed.address)
      _(rebuilt.rating).must_equal(changed.rating)
    end
  end
end
