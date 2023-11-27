import React, { RefObject, SyntheticEvent, useContext, useRef, useState } from 'react'
import './DummyForm.css';
import axios from 'axios';
import { AnswerContext } from '../Provider';
import { ErrorBoundary } from 'react-error-boundary';

function DummyForm() {
    const dbURLRef: RefObject<HTMLInputElement> = useRef(null);
    const dbNameRef: RefObject<HTMLInputElement> = useRef(null);
    const dbUserNameRef: RefObject<HTMLInputElement> = useRef(null);
    const dbPassRef: RefObject<HTMLInputElement> = useRef(null);
    const questionRef: RefObject<HTMLInputElement> = useRef(null);

    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { receivedAnswer, setReceivedAnswer} = useContext(AnswerContext);


    function onAsk(_e: SyntheticEvent) {
        setIsLoading(true);
        axios.get("/conversation/answer", {
            params: {
                dbURL: dbURLRef.current?.value,
                dbName: dbNameRef.current?.value,
                dbUserName: dbUserNameRef.current?.value,
                dbPass: dbPassRef.current?.value,
                question: questionRef.current?.value
            }
        }).then((data) => {
            console.log(data.data)
            setReceivedAnswer(JSON.stringify(data.data.data));
            /*TODO put values as a table. data.data.data will return a list. data.data.query will contain the query used 
            Create a for loop that loops over keys of the any element to get column names and then populate the table with 
            all the elements in the list*/

        }).catch(err => {
            console.log(err);
        }).finally(() => {
            setIsLoading(false);
        });
    }

    return (
        <ErrorBoundary fallback={<div>Request Failed</div>}>
            <div className="App-header">
            <div>DB Connection</div>
            <label>
                DB URL: 
                <input type="text" ref={dbURLRef} />
            </label>
            <label>
                DB Name: 
                <input type="text" ref={dbNameRef} />
            </label>
            <label>
                DB UserName:
                <input type="text" ref={dbUserNameRef} />
            </label>
            <label>
                DB Password:
                <input type="text" ref={dbPassRef} />
            </label>
    
            <label>
                Question:
                <input type="text" ref={questionRef} />
            </label>
            <button onClick={onAsk} disabled={isLoading}>Send Question</button>
    
            {receivedAnswer && <div id='received-message'>Answer: {receivedAnswer}</div>}
            </div>    
        </ErrorBoundary>
    ); 
}

export default DummyForm;