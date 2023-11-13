/**
 * Class to represent the NodeView parsed in from XML.
 * 
 * - id == MAC address of node 
 * - NodeView object is stored as a field of d3 circle/node objects within visualiser
 * 
 */
class NodeView {
    constructor(id, isAP, confidence, connections, components) {
        this.setId(id);
        this.setIsAP(isAP);
        this.setConfidence(confidence);
        this.setConnections(connections);
        this.setComponents(components);
    }

    getId() {
        return this._id;
    }

    setId(newId) {
        this._id = newId;
    }

    getIsAP() {
        return this._isAP;
    }

    setIsAP(newIsAP) {
        this._isAP = newIsAP;
    }

    getConfidence() {
        return this._confidence;
    }

    setConfidence(newConfidence) {
        this._confidence = newConfidence;
    }

    getConnections() {
        return this._connections;
    }

    setConnections(newConnections) {
        this._connections = newConnections;
    }

    getComponents() {
        return this._components;
    }

    setComponents(newComponents) {
        this._components = newComponents;
    }

    static Connection = class Connection {
        constructor(from, to, hop) {
            this.from = from;
            this.to = to;
            this.hop = hop;
        }

        getFrom() {
            return this.from;
        }

        setFrom(newFrom) {
            this.from = newFrom;
        }

        getTo() {
            return this.to;
        }

        setTo(newTo) {
            this.to = newTo;
        }

        getHop() {
            return this.hop;
        }

        setHop(newHop) {
            this.hop = newHop;
        }
    };

    static Component = class Component {
        constructor(nodes) {
            this.nodes = nodes || []; 
        }
    
        getNodes() {
            return this.nodes;
        }
    
        setNodes(newNodes) {
            this.nodes = newNodes;
        }
    
        addNode(newNode) {
            this.nodes.push(newNode);
        }
    };
    
}


export default NodeView;
