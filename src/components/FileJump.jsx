import React, { Component } from "react";
import backend from "../backend";

export default class FileJump extends Component {
  constructor(props) {
    super(props);
    this.selectFile = this.selectFile.bind(this);
    this.upload = this.upload.bind(this);

    this.state = {
      selectedFiles: undefined,
      currentFile: undefined,
      progress: 0,
      message: "",

      fileInfos: [],
    };
  }

  componentDidMount() {
    this.getFiles().then((response) => {
      this.setState({
        fileInfos: response.data,
      });
    });
  }

  uploadFile(file, onUploadProgress) {
    let formData = new FormData();

    formData.append("file", file);

    return backend.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    });
  }

  getFiles() {
    return backend.get("/files");
  }

  deleteFile(id) {
    return backend.delete(`/files/${id}`);
  }

  selectFile(event) {
    this.setState({
      selectedFiles: event.target.files,
    });
  }

  upload() {
    let currentFile = this.state.selectedFiles[0];

    this.setState({
      progress: 0,
      currentFile: currentFile,
    });

    this.uploadFile(currentFile, (event) => {
      this.setState({
        progress: Math.round((100 * event.loaded) / event.total),
      });
    })
      .then((response) => {
        this.setState({
          message: response.data.message,
        });
        return this.getFiles();
      })
      .then((files) => {
        this.setState({
          fileInfos: files.data,
        });
      })
      .catch(() => {
        this.setState({
          progress: 0,
          message: "Could not upload the file!",
          currentFile: undefined,
        });
      });

    this.setState({
      selectedFiles: undefined,
    });
  }

  render() {
    const { selectedFiles, currentFile, progress, message, fileInfos } =
      this.state;

    return (
      <div>
        {currentFile && (
          <div className="progress">
            <div
              className="progress-bar progress-bar-info progress-bar-striped"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
              style={{ width: progress + "%" }}
            >
              {progress}%
            </div>
          </div>
        )}

        <label className="btn btn-default">
          <input type="file" onChange={this.selectFile} className="form-control" />
        </label>
        <br />
        <button
          className="btn btn-success mb-3 col-sm-4"
          disabled={!selectedFiles}
          onClick={this.upload}
        >
          Upload
        </button>

          {message &&
            <div className="alert alert-light" role="alert">
              {message}
            </div>
          }

        <div className="card">
          <div className="card-header">List of Files</div>
          <ul className="list-group list-group-flush">
            {fileInfos &&
              fileInfos.map((file, index) => (
                <li className="list-group-item d-flex" key={index}>
                  <a className="col-sm-10" href={file.url}>{file.name}</a>
                  <button
                    className="btn btn-danger ms-auto"
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure you wish to delete this item?"
                        )
                      )
                        this.deleteFile(file.id).then(() => {
                          this.setState({
                            fileInfos: fileInfos.filter(
                              (f) => f.name !== file.name
                            ),
                          });
                        });
                    }}
                  >
                    Delete
                  </button>
                </li>
              ))}
          </ul>
        </div>
      </div>
    );
  }
}
