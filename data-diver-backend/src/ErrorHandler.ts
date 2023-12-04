//Error Handler middleware
const errorHandler = (err: Error, req: any, res: any, next: any) => {
    if(err) {
        console.log("Error Occurred: " + err)
        res.status(500).json({ message: err.message });
    }
}

export default errorHandler;