import React from 'react'
import { View, Text } from 'react-native'
import { TextInput, Button } from 'react-native-paper';
import axios from 'axios';

export default class AddNewPost extends React.Component {

  state = {
    desc: '',
    image: '',
    title: '',
    newPost: {}
  }

  createPostToAdd = () => {
    const newId = Date() + this.props.navigation.state.params.currentUserId
    const newPost = {
      id: newId,
      image: this.state.image,
      desc: this.state.desc,
      title: this.state.title,
      author: this.props.navigation.state.params.currentUserId
    }
    const url = 'http://localhost:3000/posts/'
    axios.post(url, newPost)
      .then(res => console.log('successfully posted a new post', res))
      .catch(err => console.log('err:', err))
  }

  render() {
    return (
      <View style={{ marginTop: 40, marginStart: 2, marginEnd: 2 }}>
        <TextInput
          label='Title'
          value={this.state.title}
          onChangeText={title => this.setState({ title })}
        />
        <TextInput
          label='Image Url'
          value={this.state.image}
          onChangeText={image => this.setState({ image })}
        />
        <TextInput
          style={{ height: 200 }}
          label='Post Description'
          value={this.state.desc}
          multiline={true}
          onChangeText={desc => this.setState({ desc })}
        />
        <Button onPress={this.createPostToAdd}>Add Post</Button>
      </View>
    )
  }

  componentDidMount = () => {
  }
}