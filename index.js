const express = require('express');
const path = require('path');
const SSE = require('sse-emitter');

const sse = new SSE(
    {
        keepAlive: 30000, // in ms, defaults to 10000
    }
)

const app = express()

const progress = {}

app.get('/', (req, res) => 
    {
        res.sendFile(path.join(__dirname + '/index.html'))
    }
)

app.post('/process', (req, res) => 
    {
        progress.job_1 = 0
        res.send('1')
        

        const timer = setInterval(() => 
        {
            sse.emit(
                '/job/1', 
                {
                    percentage: progress.job_1
                }
            )

            progress.job_1 += 10

            if(progress.job_1 > 100)
            {
                clearInterval(timer)
            }
        }, 1000)
    }
)

app.get('/job/:id', sse.bind())

app.listen(8080)

