import React from 'react';
import { Appbar, FAB, Button } from 'react-native-paper'
import { View, Text, FlatList, StyleSheet } from 'react-native'
import axios from 'axios'
import PostCard from './comp/PostCard';

const currentUserId = 2

export default class Core extends React.Component {

  static navigationOptions = {
    title: 'Home'
  }

  state = {
    posts: [],
    currentUser: {},
    currentUserId: null
  }

  fetchPosts = () => {
    const url = 'http://localhost:3000/posts'
    axios.get(url)
      .then(res => {
        this.setState({
          posts: res.data
        })
      })
      .catch(err => console.log('err:', err))
  }

  fetchCurrentUserDetails = () => {
    // get current used id from async storage
    const url = `http://localhost:3000/users/${currentUserId}`
    axios.get(url).then(
      res => {
        console.log('res within current user:', res.data)
        this.setState({
          currentUser: res.data
        })
      }
    ).catch(err => console.log('err:', err))

  }

  render() {
    if (typeof (this.state.currentUser.id) === 'undefined') {
      return <Text>Loading ...</Text>
    }
    else {
      return (
        <View style={{ flex: 1 }}>
          <Appbar>
            <Appbar.Header><Text style={{ color: 'white' }}>My Special Blog</Text></Appbar.Header>
          </Appbar>

          <FlatList
            style={{ flex: 1 }}
            data={this.state.posts}
            keyExtractor={(item, index) => item.id}
            renderItem={({ item }) =>
              <PostCard currentUser={this.state.currentUser} singlePost={item} />}
          />

          <FAB
            small
            style={styles.fab}
            icon="add"
            onPress={() => this.props.navigation.navigate('NewPost', { currentUserId: currentUserId })}
          />
          <Button onPress={() => this.props.navigation.navigate('Auth')}>Logout</Button>
        </View>
      );
    }

  }

  componentDidMount = () => {
    this.fetchPosts()
    this.fetchCurrentUserDetails()
    this.setState({
      currentUserId: this.props.navigation.state.params.loggedInUser
    })
  }
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    backgroundColor: 'red',
    bottom: 0,
  },
})