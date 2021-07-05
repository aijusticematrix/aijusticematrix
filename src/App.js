import './App.css';
import { useForm, useField, splitFormProps } from "react-form";
import React from "react";
import RelatedNetwork from "./RelatedNetwork";
import { DataSet } from "vis-data";
import update from 'immutability-helper';


const serverLocal = 'http://localhost:3001';
const serverRemote = 'https://66.29.140.14:3000/'

const server = serverRemote;

function SelectField(props) {
  const [field, fieldOptions, { options, ...rest }] = splitFormProps(props);

  const {
    value = "",
    setValue,
    meta: { error, isTouched }
  } = useField(field, fieldOptions);

  const handleSelectChange = e => {
    setValue(e.target.value);
  };

  return (
    <>
      <select {...rest} value={value} onChange={handleSelectChange}>
        <option disabled value="" />
        {options.map(option => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>{" "}
      {isTouched && error ? <em>{error}</em> : null}
    </>
  );
}

const InputField = React.forwardRef((props, ref) => {
  // Let's use splitFormProps to get form-specific props
  const [field, fieldOptions, rest] = splitFormProps(props);

  // Use the useField hook with a field and field options
  // to access field state
  const {
    meta: { error, isTouched, isValidating },
    getInputProps
  } = useField(field, fieldOptions);

  // Build the field
  return (
    <>
      <input {...getInputProps({ ref, ...rest })} />{" "}
      {isValidating ? (
        <em>Validating...</em>
      ) : isTouched && error ? (
        <em>{error}</em>
      ) : null}
    </>
  );
});


const InputArea = React.forwardRef((props, ref) => {
  // Let's use splitFormProps to get form-specific props
  const [field, fieldOptions, rest] = splitFormProps(props);

  // Use the useField hook with a field and field options
  // to access field state
  const {
    meta: { error, isTouched, isValidating },
    getInputProps
  } = useField(field, fieldOptions);

  // Build the field
  return (
    <>
      <textarea style={{
        margin: "0px",
        width: "100%",
        height: "140px"
      }} {...getInputProps({ ref, ...rest })} />{" "}
      {isValidating ? (
        <em>Validating...</em>
      ) : isTouched && error ? (
        <em>{error}</em>
      ) : null}
    </>
  );
});


function MyForm(props) {
  // Use the useForm hook to create a form instance
  const {
    Form,
    meta: { isSubmitting, canSubmit }
  } = useForm({
    onSubmit: async (values, instance) => {
      // onSubmit (and everything else in React Form)
      // has async support out-of-the-box
      if (props.selectedNode)
      {
        await props.addMessageToNode(props.selectedNode, values);
      } else {
        await props.postNewNodeToServer(props.selectedNode, values);
      }
      if (values.linked_node) {
        await props.addLinkToNode(props.selectedNode, values.linked_node);
      }
    },
    debugForm: false
  });

  return (
    <Form>
        {!props.selectedNode && 
      <div>
        <header> Create a new node </header>
        <p>
          <InputField field="new_node_name" placeholder="Enter Node Name" />
        </p>
        </div>
      }
      <div>
        <label>
          Message: {" "}
          <InputArea field="message" />
        </label>
      </div>

      <div>
      <label>
          Optionally Link to an existing node: 
          <SelectField
            field="linked_node"
            options={props.node_names}
          />
        </label>
      </div>
      <div>
      <label> Add media url? </label>
        <InputField field="media_url" placeholder="Link to an image, video, or sound file" />
      </div>
      <div>
        <button type="submit" disabled={!canSubmit}>
          Submit
        </button>
      </div>

      <div>
        <em>{isSubmitting ? "Submitting..." : null}</em>
      </div>
    </Form>
  );
}

// view selected node
// view subheadings for each edge leaving the node
  async function getDataFromServer (data) {

    await new Promise(resolve => setTimeout(resolve, 1000));
    return data;
  }
  
function Message ({text, url}) {
  return (
    <div style={{backgroundColor: "rgb(220,220,220)"}}>
    <p style={{backgroundColor: "rgb(9, 95, 163)"
              }}>{text}</p>
    <p style={{backgroundColor: "rgb(9, 25, 103)"
              }}>{url}</p>
              </div>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {nodes: [], edges: [], selectedNode: null, canEdit: false};
    this.changeSelectedNode = this.changeSelectedNode.bind(this);
    this.addMessageToNode = this.addMessageToNode.bind(this);
    this.postNewNodeToServer = this.postNewNodeToServer.bind(this);
    this.addLinkToNode = this.addLinkToNode.bind(this);
  }

  checkAccess () {
    fetch(server + '/can_access')
    .then(res => res.json())
    .then((data) => {
      this.setState({ canEdit: data[0].access });
    })
    .catch(console.log)  
  }

  getNodes () {
    fetch(server + '/nodes')
    .then(res => res.json())
    .then((data) => {
      this.setState({ nodes: data })
    })
    .catch(console.log)
  }

  getEdges () {
    fetch(server + '/links')
    .then(res => res.json())
    .then((data) => {
      this.setState({ edges: data })
    })
    .catch(console.log)
  }
  
  componentDidMount() {
      this.checkAccess();
      this.getNodes();
      this.getEdges();
  }

  setNode(selectedNode) {
  }
  
  changeSelectedNode(selectedNode) {
    const nodeObject = this.state.nodes.find(node => node.id === selectedNode);
    this.setState({ selectedNode: nodeObject});
    console.log(nodeObject);
  }

  postNewNodeToServer(selectedNode, {new_node_name, message, media_url}){
    var messages = [];
    var newNode = { id: new_node_name, label:new_node_name, messages: message ? messages.concat([message]) : [], url: media_url };
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newNode)
  };
    fetch(server + '/nodes', requestOptions)
        .then(response => response.json())
        .then(data => this.setState({nodes: this.state.nodes.concat([newNode])}));
  }

  updateNodeToServer(selectedNode, {message, media_url}){
    console.log(message, media_url)
    const post = {text: message, url: media_url}
    const messages = selectedNode.messages ? selectedNode.messages : [];
    const newNode = { id: selectedNode.id, label:selectedNode.label, messages: messages.concat(post) }

    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newNode)
  };
    fetch(server + '/nodes/' + selectedNode.id, requestOptions)
        .then(response => response.json())
        .then(data => this.setState({selectedNode: data}))
  }

  addMessageToNode(selectedNode, values){
    this.updateNodeToServer(selectedNode, values);
  }

  addLinkToNode(from, to) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({id: from + to, from: from.id, to})
  };
  console.log("rew", requestOptions)
    fetch(server + '/links/', requestOptions)
        .then(response => response.json())
        .then(data => this.getEdges())
  }

  
  render () {
    return (
      <div className="App">
        <div className="graph" style={{
				  height: `1024px`,
				  width: `70%`,
				  maxWidth: "1024px",
				  minWidth: "30%",
				  maxHeight: "512px",
          float:`left` 
        }}>
          <RelatedNetwork
            nodes= {this.state.nodes}
            edges= {this.state.edges}
            changeSelectedNode = {this.changeSelectedNode}
          />
        </div>
        <div className="form" style={{
				  height: `1024px`,
				  width: `20%`,
				  maxWidth: "1024px",
				  minWidth: "30%",
				  maxHeight: "512px",
          float:`right` 
			  }}>
          { this.state.selectedNode && <div><header className="selectedNode"> { "Selected Node: "}</header> 
            <p>{this.state.selectedNode?.id } </p> </div>}
          {this.state.selectedNode?.messages?.map(message => 
          <Message
            text={message?.text}
            url={message?.url}
          />
          )}
          {this.state.canEdit &&
            <MyForm
              selectedNode={this.state.selectedNode}
              addMessageToNode = {this.addMessageToNode} 
              postNewNodeToServer = {this.postNewNodeToServer}
              addLinkToNode = {this.addLinkToNode} 
              node_names = {this.state.nodes.map (n => n.id)}

            />}
        </div>
      </div>
    );
  }
}

export default App;
  