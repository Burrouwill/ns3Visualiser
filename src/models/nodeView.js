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
}

export default NodeView;
