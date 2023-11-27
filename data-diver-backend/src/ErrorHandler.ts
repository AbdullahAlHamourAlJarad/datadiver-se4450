//Error Handler middleware
const errorHandler = (err: any, req: any, res: any, next: any) => {
    if(err) {
        console.log("Error Occurred: " + err)
        res.status(500).json({ err: err });
    }
}

export default errorHandler;