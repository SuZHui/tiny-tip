export abstract class ILifecycle {
    state: {
        isCreated: boolean;
        isDestroyed: boolean;
    }

    constructor() {
        this.state = {
            isCreated: false,
            isDestroyed: false
        }
    }

    abstract create(): void;
    abstract update(): void;
    abstract destroy(): void;
}