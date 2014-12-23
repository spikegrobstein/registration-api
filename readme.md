# Registration API

This is a dead-simple node.js app that handles incoming POSTS
from new network nodes and saves them into memory, expiring after
2 minutes.

It's designed to be used in a scenario like the following:

 1. Newly booted nodes (VMs, etc) in an environment contain an agent
    that's fired via cron every minute, POSTing data to this service
    containing arbitrary data and what it thinks its hostname is.
 2. A configuration management system can query this API to retrieve
    a list of these new nodes so it can configure accordingly with
    Chef or something similar.
 3. At the configuration step, the agent can be disabled.
 4. The configuration management system can manually delete the
    node from this service.

It's goal is to solve a simple problem for small deployments (less than
100 nodes) and the service is as stupid as possible for that reason.

## Running the service

    npm install
    node server.js

The service runs on port 3000 and listens on `0.0.0.0`. This is currently
hard-coded.

Also hard-coded is a 1 minute node cleanup function, which deletes
nodes from the internal database that are older than the specified
threshold.

The threshold is also hard-coded at 2 minutes.

## Endpoints

This service has 3 endpoints:

 1. `POST /nodes/:hostname` -- to register a new host by hostname
 2. `DELETE /nodes/:address` -- to remove this node from the DB, by IP
 3. `GET /nodes` -- returns a list of all currently registered nodes

### POST

The POST endpoint can accept a JSON body containing a key at the
top-level called `data` which can contain arbitrary data to be
used at the configuration step.

The internal representation of data of registered nodes is keyed by
the IP where the request came from, so if another node comes up
and registers that shares the IP with an existing node, it'll overwrite
it.

### DELETE

When deleting nodes, you should use the IP since it is potentially
possible that 2 nodes could share the same hostname, depending on
how you provision systems on your infrastructure.

### GET

When retrieving a list of all nodes in the system, it's returned as
a JSON object keyed by IP of the nodes, and the value for each key
is a hash containing the provided `data` field, a `hostname` field and
a `datestamp` field which is the time, in milliseconds, of when the
node last registered.

## Author and License

This project is written by Spike Grobstein (me@spike.cx) and is
licensed under the MIT license. See LICENSE.md for details.

Github: https://github.com/spikegrobstein/registration-api

