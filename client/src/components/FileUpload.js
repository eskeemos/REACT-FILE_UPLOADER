import React, { Fragment, useState } from 'react';
import Message from './Message';
import Progress from './Progress';
import axios from 'axios';


const FileUpload = () => {
    const [file, setFile] = useState('');
    const [upladedFile, setUploadedFile] = useState({});
    const [message, setMessage] = useState('');
    const [uploadPercentage, setUploadPercentage] = useState(0);

    const onChange = e => {
        setFile(e.target.files[0]);
    }

    const onSubmit = async e => {

        e.preventDefault();

        const formData = new FormData();
        if(!Boolean(file)) return;
        formData.append('file', file);

        try {
            const res = await axios.post('/upload', formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                onUploadProgress: progressEvent => {
                    setUploadPercentage(
                      parseInt(
                        Math.round((progressEvent.loaded * 100) / progressEvent.total)
                      )
                    );
                }
            })

            setTimeout(() => setUploadPercentage(0), 5000);

            const {fileName, filePath} = res.data;

            setUploadedFile({fileName, filePath});

            setMessage("File Uploaded");

        } catch (err) {
            if(err.response.status === 500){
                setMessage("SERVER PROBLEM");
            }else{
                setMessage(err.response.data.msg);
            }
        }
    }

    return (
        <Fragment>
            {message ? <Message msg={message} /> : null}
            <form onSubmit={onSubmit} className="mb-3">
                <div className="input-group">
                    <input type="file" className="form-control" onChange={onChange}/>
                    <input type="submit" className="btn btn-outline-secondary" value="Upload" />
                </div>
            </form>

            <Progress percentage={uploadPercentage}/>
            
            {upladedFile ? <div className="row mt-5">
                <div className="col-md-6 m-auto">
                    <h3 className="text-center">{upladedFile.fileName}</h3>
                    <img style={{width: '100%'}} src={upladedFile.filePath} alt="" />
                </div>
            </div> : null}
        </Fragment>
    )
}

export default FileUpload
