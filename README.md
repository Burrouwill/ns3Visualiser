# XML Data Parsing

## Initial Data Parsing
- Initially, we parse the entire XML log file into a JSON array.
  - This JSON array contains an array of arrays of all log/packet types stored as JSON.

## Desired Packet/Log Types Extraction
- The desired packet/log types are then extracted from this data and further subdivided into two data subsets:

### Root
- Initially, we parse the entire XML log file into a JSON array.
  - This contains an array of arrays of all log/packet types stored as JSON.
    - Log Array 1
    - Log Array 2
    - ...

- The desired packet/log types are then extracted from this data and split into two subsets:

### Nodedata
- Node packets: Contain the initial data required to create the nodes.
- Non-p2p link properties: Contain the IPv4 and MAC addresses of the nodes.

### SimulationData
- PR packets: Contain a wealth of information in the meta-info field, with connections logged here.
- NU packets: Three subtypes:
  - 'c': color
  - 's': size
  - 'p': positional (used for node movement)

# Connection Establishment Protocol (Via MAC Address)

1. Source Node/Source Address (SA) sends a packet to the destination address (DA).
   - ns3::dot11s::PeerLinkOpenStart
2. The destination node sends a return packet to the source node.
   - ns3::dot11s::PeerLinkConfirmStart
3. The connection is then established from SA to DA.

# Movement of Nodes

- Node movement is expressed in terms of x and y.
- The presence of 'nu' at the start of an XML statement/packet indicates that this is a delta of nodes. It includes the node ID and new x and y coordinates. These coordinates represent the change in position.

# Simulation

- Simulation events are handled through a loop that iterates through all simulation events.
- Methods are used to handle:
  - Connections broken
  - Connections established
  - Node movements
