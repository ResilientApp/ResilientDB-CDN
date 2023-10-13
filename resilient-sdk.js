export default class ResilientSDK {
    constructor(targetOrigin = '*') {
        this.targetOrigin = targetOrigin;
        this.messageHandlers = [];
    }

    /**
     * Send a message using postMessage.
     * @param {Object} message - The message to send.
     */
    sendMessage(message) {
        window.postMessage(message, this.targetOrigin);
    }

    /**
     * Add a message listener for the content script.
     * @param {Function} handler - The handler to invoke when a message is received.
     */
    addMessageListener(handler) {
        if (typeof handler !== 'function') {
            throw new Error('Handler must be a function');
        }
        this.messageHandlers.push(handler);
        if (this.messageHandlers.length === 1) {
            this._startListening();
        }
    }

    /**
     * Remove a message listener.
     * @param {Function} handler - The handler to remove.
     */
    removeMessageListener(handler) {
        const index = this.messageHandlers.indexOf(handler);
        if (index !== -1) {
            this.messageHandlers.splice(index, 1);
        }
        if (this.messageHandlers.length === 0) {
            this._stopListening();
        }
    }

    _startListening() {
        window.addEventListener('message', this._messageHandler.bind(this));
    }

    _stopListening() {
        window.removeEventListener('message', this._messageHandler.bind(this));
    }

    _messageHandler(event) {
        // Conditional check for origin, source, and data type
        if (event.source === window && event.data && event.data.type === 'FROM_CONTENT_SCRIPT') {
            for (const handler of this.messageHandlers) {
                handler(event);
            }
        }
    }
}
