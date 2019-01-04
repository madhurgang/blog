import React from 'react'
import { View, Picker, Text } from 'react-native'
import { TextInput, Button } from 'react-native-paper';
import axios from 'axios';
import { SITE_URL } from '../Constants';

export default class AddNewPost extends React.Component {

  state = {
    desc: '',
    image: '',
    title: '',
    category: '',
    newPost: {},
    cats: [],
    selectedCat: 'others'
  }

  createPostToAdd = () => {
    const newId = Date() + this.props.navigation.state.params.currentUserId
    const newPost = {
      id: newId,
      image: this.state.image,
      desc: this.state.desc,
      title: this.state.title,
      category: this.state.category,
      author: this.props.navigation.state.params.currentUserId
    }
    const url = 'http://localhost:3000/posts/'
    axios.post(url, newPost)
      .then(res => console.log('successfully posted a new post', res))
      .catch(err => console.log('err:', err))
  }

  getCategories = () => {
    axios.get(SITE_URL + '/categories')
      .then(cats => this.setState({ cats: cats.data }))
      .catch(err => console.log('err:', err))
  }

  render() {
    if (this.state.cats.length < 1)
      return <Text>Loading..</Text>
    else
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
          <Picker
            selectedValue={this.state.selectedCat}
            style={{ height: 50, width: 100, marginLeft: 0 }}
            onValueChange={(itemValue, itemIndex) => this.setState({ selectedCat: itemValue })}>
            <Picker.Item key={'others'} label={'others'} value={'others'} />
            {this.state.cats.map(
              (cat, index) => <Picker.Item key={cat.id} label={cat.name} value={cat.name} />
            )}
          </Picker>

          <Button style={{ marginTop: 100 }} onPress={this.createPostToAdd}>Add Post</Button>
        </View>
      )
  }

  componentDidMount = async () => {
    await this.getCategories()
  }
}