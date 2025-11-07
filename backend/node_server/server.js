import {exec} from 'child_process';

const content = "Describe how a neural network works";

exec(`python ./py_service/main.py ${content}`, (error, stdout, stderr) => {
    if(error) {
        console.error(`Error starting video microservice: ${error.message}`);
        return;
    }
    if(stderr) {
        console.error('Stderr:', stderr);
    }
    console.log('output: ', stdout);
});