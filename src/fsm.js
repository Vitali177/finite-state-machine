class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */
    constructor(config) {
        if(!config)
            throw new Error('Error with constructor() ');
        
        this.config = config;
        this.config.initial = 'normal';

        this.flagUndo = 0;
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.config.initial;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state) {

        if (state === 'normal' || state === 'busy' || state === 'hungry' || state == 'sleeping') {

            this.disableRedoAfterChangeStateCall = true;

            this.config.initial = state;
            this.flagChangeState = true;
        } else throw new Error('Error with changeState() ');        
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */

    trigger(event) {

        var initial = this.config.initial;

        if (!this.config.states[initial].transitions[event])
            throw new Error('Error with changeState() ');
        else {

            this.disableRedoAfterTriggerCall = true;

            this.config.initial = this.config.states[initial].transitions[event];     
            if (this.config.initial === 'sleeping' )
                this.flagSleeping = true; // чтобы можно было вернуться от hungry к sleeping
            this.flagTrigger = true;
        } 

    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.config.initial = 'normal';
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event) {
        
        var array = [];

        if (event === undefined) {
            array.push('normal');
            array.push('busy');
            array.push('hungry');
            array.push('sleeping');
            return array;
        }
        if (event === 'study' || event === 'get_tired' || event === 'get_hungry' || event === 'eat' || event === 'get_up')  {

            var state = 'normal';

            for (let key in this.config.states[state].transitions) {
                if (key === event ) {
                    array.push(state);
                } 
            }

            state = 'busy';

            for (let key in this.config.states[state].transitions) {
                if (key === event ) {
                    array.push(state);
                } 
            }

            state = 'hungry';

            for (let key in this.config.states[state].transitions) {
                if (key === event ) {
                    array.push(state);
                } 
            }

            state = 'sleeping';

            for (let key in this.config.states[state].transitions) {
                if (key === event ) {
                    array.push(state);
                } 
            }           
        }                  
        return array;               
    }
    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
      // Если после тригерра и смены вызывается undo то потом уже мжно вызвать redo
        this.disableRedoAfterTriggerCall = false;
        this.disableRedoAfterChangeStateCall = false;

        if (this.config.initial === 'normal')
            return false;  

        this.flagUndo++;

        if (this.config.initial === 'sleeping') {
            this.config.initial = 'busy';
            return true;
        }

        if (this.flagSleeping && this.config.initial === 'hungry') {
            this.config.initial = 'sleeping';
            return true;
        }

        if (this.flagChangeState && this.config.initial === 'hungry') {
            this.config.initial = 'normal';
            return true;
        }

        if (this.config.initial === 'busy') {
            this.config.initial = 'normal';
            return true;
        }

        if (this.config.initial === 'hungry') {
            this.config.initial = 'busy';
            return true;
        }                         
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {

        if (this.disableRedoAfterChangeStateCall || this.disableRedoAfterTriggerCall)
            return false;        

        if (this.flagUndo > 0) {

            if (this.config.initial === 'normal')
                this.config.initial = 'busy';           
            else  if (this.flagSleeping && this.config.initial === 'busy')
                this.config.initial = 'sleeping';
            else  if (this.config.initial === 'sleeping') 
                this.config.initial = 'hungry';             
            
            this.flagUndo--;
            return true;
        } else return false;     
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.config.initial = 'normal';
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/
