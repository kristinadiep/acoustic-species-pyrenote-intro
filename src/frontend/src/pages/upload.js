import React from 'react';
import { withRouter } from 'react-router';
import { withStore } from '@spyna/react-store';
import { FormAlerts } from '../components/alert';
import { Button } from '../components/button';
import Loader from '../components/loader';
import {LoadingBar} from '../components/loader';

class Upload extends React.Component {
    constructor(props) {
        super(props);
        console.log(props)
        let { projectId } = this.props;
        const { apiKey, projectName } = this.props;
        projectId = Number(projectId);
        const { history } = this.props;
        this.history = history
        console.log(history)
        this.initialState = {
          apiKey,
          projectId,
          projectName,
          errorMessage: '',
          successMessage: '',
          isLoading: false,
          isSubmitting: false,
          isSample: false,
          projectUrl: `/api/projects/${projectId}`,
          getUsersUrl: '/api/users',
          uploadUrl: 'api/data/admin_portal',
          updateUsersProject: `/api/projects/${projectId}/users`,
          value: '',
          files: {},
          currentFile: 0
        };
    
        this.state = { ...this.initialState };
      }
    
      handleUpload(sample = false, start = 0, chunk = 5, callback) {
        console.log(sample, start, chunk)
        const { uploadUrl, apiKey, files, value } = this.state;
        const formData = new FormData();
        let isThereMoreData = true;
        let i = start
        let count = 0
        for (; i < files.length && i - start < chunk; i++) {
          
         
          const file = files[i];
          console.log(i, file, count)
          formData.append(count, file);
          count++
        }
    
        if (i >= files.length) {
          isThereMoreData = false
        }
        formData.append('apiKey', apiKey);
        formData.append('username', ['admin', 'admin']);
        formData.append('file_length', count);
        formData.append('sample', sample);
        formData.append('sampleJson', value);
        this.setState({ isLoading: true, currentFile: i });
        fetch(uploadUrl, {
          method: 'POST',
          body: formData,
          headers: {
            Authorization: localStorage.getItem('access_token')
          }
        }).then(response => {
          const msg = response.json();
          msg.then(data => {
            if (data.code !== 201 && data.type !== 'DATA_CREATED') {
              this.setState({
                isSubmitting: false,
                errorMessage: data.message,
                successMessage: null,
                isLoading: false
              });
            } else {
              if (isThereMoreData) {
                console.log("next upload", i, chunk)
                this.handleUpload(sample, i, chunk)
              } else {
                this.setState({
                  isSubmitting: false,
                  successMessage: data.message,
                  errorMessage: null,
                  isLoading: false,
                  files: {},
                  currentFile: 0,
                });
              }
            }
          });
        });
      }
    
      handleAlertDismiss(e) {
        e.preventDefault();
        this.setState({
          successMessage: '',
          errorMessage: ''
        });
      }
    
      handleChangeText(e) {
        this.setState({ value: e.target.value });
      }
    
      onChangeHandler(e) {
        const files = e.target.files;
        this.setState({ files });
        let text = '{\n';
        Array.prototype.forEach.call(files, file => {
          text = `${text} "${file.name}":           , \n`;
        });
        text += '}';
        this.setState({ files, value: text });
    
        /* const jsonEditor = document.getElementById("json_editor");
        jsonEditor.style.height = jsonEditor.scrollHeight + "px" */
      }
    
      resetState() {
          
        this.setState(this.initialState);
      }

      handleAnnotate() {
        this.history.push('/annotate')
        
        
      }
    
      render() {
        const { isSubmitting, errorMessage, successMessage, isLoading, isSample, value, files, currentFile } = this.state;
        return (
          <div className="container h-75 text-center">
            <div>
              {isLoading ? <Loader/> : null}
              <LoadingBar total={files.length} current={currentFile} />
              <FormAlerts
                errorMessage={errorMessage}
                successMessage={successMessage}
                callback={e => this.handleAlertDismiss(e)}
              />
            </div>
            <div className="row h-100 justify-content-center align-items-center">
              <input
                type="file"
                name="file"
                onChange={e => {
                  this.onChangeHandler(e);
                }}
                multiple
              />
              <div className="form-row">
                  <Button
                    size="lg"
                    type="primary"
                    disabled={isSubmitting}
                    onClick={() => this.handleUpload(isSample)}
                    isSubmitting={isSubmitting}
                    alt="Uploading"
                    text="Upload"
                  />
                  <Button
                    size="lg"
                    type="primary"
                    disabled={isSubmitting}
                    onClick={() => this.handleAnnotate()}
                    isSubmitting={isSubmitting}
                    alt="Uploading"
                    text="Annotate"
                  />
                </div>
              </div>
            </div>
        );
      }
    }
    

export default Upload