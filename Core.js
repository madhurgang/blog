import React from 'react';
import { Appbar, FAB, Button, Searchbar } from 'react-native-paper'
import { View, Text, FlatList, StyleSheet } from 'react-native'
import axios from 'axios'
import PostCard from './comp/PostCard';
import { getDataFromLocal, removeDataFromLocal } from './helpers/helpers';

export default class Core extends React.Component {

  static navigationOptions = {
    title: 'Home'
  }

  state = {
    posts: [],
    currentUser: {},
    firstQuery: ''
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

  handleLogout = async () => {
    await removeDataFromLocal('user')
    this.props.navigation.navigate('Auth')
  }

  render() {
    if (typeof (this.state.currentUser.id) === 'undefined') {
      return <Text>Loading ...</Text>
    }
    else {
      return (
        <View style={{ flex: 1 }}>

          <Searchbar
            style={{ color: 'black' }}
            placeholder="Search"
            onChangeText={query => { this.setState({ firstQuery: query }); }}
            value={this.state.firstQuery}
          />

          <FlatList
            style={{ flex: 1 }}
            data={this.state.posts.filter(post => post.title.includes(this.state.firstQuery))}
            keyExtractor={(item, index) => item.id}
            renderItem={({ item }) =>
              <PostCard currentUser={this.state.currentUser} singlePost={item} />}
          />

          <FAB
            small
            style={styles.fab}
            icon="add"
            onPress={() => this.props.navigation.navigate('NewPost', { currentUserId: this.state.currentUser.id })}
          />
          <Button onPress={() => this.handleLogout()}>Logout</Button>
        </View>
      );
    }

  }

  componentDidMount = async () => {
    this.fetchPosts()
    const foundUser = await getDataFromLocal('user')
    this.setState({
      currentUser: foundUser
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