import React from 'react'
import { View, Text } from 'react-native'
import { Button, TextInput } from 'react-native-paper';
import { findInList, saveDataToLocal, getDataFromLocal } from './helpers/helpers';
import axios from 'axios'

export default class Auth extends React.Component {
  state = {
    name: '',
    password: '',
    userList: []
  }

  handleNameChange = (name) => {
    this.setState({ name })
  }

  handlePasswordChange = (password) => {
    this.setState({ password })
  }

  handleSubmit = () => {
    // api call
    const toBeFound = {
      username: this.state.name,
      password: this.state.password
    }
    console.log('this.state:', this.state)
    const found = findInList(toBeFound, this.state.userList)
    if (found) {
      // save found object to loal storage
      saveDataToLocal('user', found)
      this.props.navigation.navigate('Core')
    }

  }

  render() {
    return (
      <View style={{ marginTop: 40 }}>
        <Text>Auth Page</Text>
        <TextInput
          style={{ marginTop: 10 }}
          onChangeText={(v) => this.handleNameChange(v)}
          value={this.state.name}
          label='Enter Name' placeholder='Apna naam daliye!' />
        <TextInput
          style={{ marginTop: 10 }}
          onChangeText={(v) => this.handlePasswordChange(v)}
          value={this.state.password}
          secureTextEntry={true}
          label='Enter Password' placeholder='Apna naam daliye!' />

        <Button onPress={() => this.handleSubmit()}>Send to home</Button>
      </View>
    );
  }

  componentDidMount = async () => {
    // if user exist in local
    // navugate to core
    const foundUser = await getDataFromLocal('user')
    if (foundUser) {
      this.props.navigation.navigate('Core')
    }
    else {
      axios.get('http://localhost:3000/users')
        .then(res => {
          this.setState({ userList: res.data })
        })
        .catch(err => alert(err))
    }

  }

}