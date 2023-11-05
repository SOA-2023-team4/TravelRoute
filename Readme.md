# TravelRoute
Application to allow travellers to plan their trip effortlessly

## Overview
TravelRoute gets data from GoogleMap's API, 

## Objectives
### Short-term usability goals
* Pull data from GoogleMaps API
* Display the order to visit place
  * Places can be clicked to show further details

### Long-term goals
* Multi-Stage Travel Planner
  * Pick the places you are interested in
  * Specify Constraints (Priority, Preferences Modify Information)
  * Page For Checking out the final plan

## Setup
* Create a Google API access key
* Add the required thingy into config/secrets.yml
* Run `bundle install`
* Run `bundle exec rake db:migrate`
* Run `RACK_ENV=test bundle exec rake db:migrate`
