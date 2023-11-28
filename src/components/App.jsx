import React, {useReducer} from "react";
import "../styles.css";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";

export const ACTIONS={
    ADD_DIGIT: "add-digit",
    CHOOSE_OPERATION: "choose-operation",
    CLEAR: "clear",
    DEL_DIGIT: "clear-digit",
    EVALUATE: "evaluate"
}


function reducer(state, {type, payload}){
    switch(type) {
        case ACTIONS.ADD_DIGIT:
            // console.log(state.currNum);
            if(state.overwrite){
                return{
                    ...state,
                    currNum: payload.digit,
                    overwrite: false
                }
            }
            if(payload.digit === "0" && state.currNum === " 0"){     
               return state; 
            }  
            if(payload.digit === "." && state.currNum.includes(".")){
              return state;  
            } 
            return{
                ...state, 
                currNum:`${state.currNum || ""}${payload.digit}`
            }
        case ACTIONS.CLEAR:
            return {};

        case ACTIONS.CHOOSE_OPERATION:
            if(state.currNum==null && state.prevNum==null){
               return state; 
            } 
            if(state.currNum==null){
                return{
                    ...state,
                    operation: payload.operation
                }
            } 
            if(state.prevNum==null){ 
                return {
                    ...state, 
                    operation: payload.operation,
                    prevNum: state.currNum,
                    currNum: null
                }
            }

            return{
                ...state,
                operation: payload.operation,
                prevNum: evaluate(state),
                currNum: null
            }
        case ACTIONS.EVALUATE:
            if(state.operation==null||state.currNum==null || state.prevNum==null ){
                return state
            }

            else return{
                ...state,
                prevNum: null,
                operation: null,
                overwrite: true,
                currNum: evaluate(state)
            }
        case ACTIONS.DEL_DIGIT:
            if(state.overwrite){
                return{
                    ...state,
                    currNum: null,
                    overwrite: false
                }
            }

            if(state.currNum==null) return state

            if(state.currNum.length === 1){
                return{
                    ...state,
                    currNum: null
                }
            }

            return{
                ...state,
                currNum: state.currNum.slice(0, -1)
            }
    }
}

function evaluate({currNum, prevNum, operation}){
    let curr=parseFloat(currNum);
    let prev=parseFloat(prevNum);

    // console.log(curr);
    // console.log(prev);
    if(isNaN(curr) || isNaN(prev)){
        return "";
    }

    let ans="";
    switch(operation){
        case "+":
            ans=prev+curr
            break

        case "-":
            ans=prev-curr
            break

        case "*":
            ans=curr * prev
            break

        case "÷":
            ans=prev/curr
            break
    }

    return ans.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
    maximumFractionDigits: 0
})

function formatOperand(operand){
    if(operand==null) return

    const [integer, decimal] = operand.split('.')
    if(decimal==null) return INTEGER_FORMATTER.format(integer)

    return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}
const App=()=>{
    
    const [{currNum, prevNum, operation}, dispatch]=useReducer(reducer, { });
    // const [state, dispatch] = useReducer(reducer, {});
    // const { currNum, prevNum, operation } = state;

    return(
        <div className="calculator">
            <div className="output">
                <div className="previous">{formatOperand(prevNum)}{operation}</div>
                <div className="current">{formatOperand(currNum)}</div>
            </div>
            <button className="span-two" onClick={()=> dispatch({type: ACTIONS.CLEAR})}>AC</button>
            <button  onClick={()=> dispatch({type: ACTIONS.DEL_DIGIT})}>DEL</button>
            
            <OperationButton operation="÷" dispatch={dispatch} />
            <DigitButton digit="1" dispatch={dispatch} />
            <DigitButton digit="2" dispatch={dispatch} />
            <DigitButton digit="3" dispatch={dispatch} />
            <OperationButton operation="*" dispatch={dispatch} />
            <DigitButton digit="4" dispatch={dispatch} />
            <DigitButton digit="5" dispatch={dispatch} />
            <DigitButton digit="6" dispatch={dispatch} />
            <OperationButton operation="+" dispatch={dispatch} />
            <DigitButton digit="7" dispatch={dispatch} />
            <DigitButton digit="8" dispatch={dispatch} />
            <DigitButton digit="9" dispatch={dispatch} />
            <OperationButton operation="-" dispatch={dispatch} />
            <DigitButton digit="." dispatch={dispatch} />
            <DigitButton digit="0" dispatch={dispatch} />
            <button className="span-two" onClick={()=> dispatch({type: ACTIONS.EVALUATE})} >=</button>
        </div>
    );
}

export default App;