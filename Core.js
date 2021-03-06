import React from 'react';
import { Appbar, FAB, Button, Searchbar } from 'react-native-paper'
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native'
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
    firstQuery: '',
    currentPage: 1,
    pageLimit: 5,
    endOflistNahiHua: true
  }

  fetchPosts = () => {
    const url = `http://localhost:3000/posts?_page=${this.state.currentPage}&_limit=${this.state.pageLimit}`
    axios.get(url)
      .then(res => {
        this.setState({
          posts: [...this.state.posts, ...res.data],
          totalCount: 15
        })
      })
      .catch(err => console.log('err:', err))
  }

  loadNextPage = () => {
    if ((this.state.currentPage * this.state.pageLimit) < (this.state.totalCount)) {
      this.setState({
        currentPage: this.state.currentPage + 1
      }, () => this.fetchPosts())
    }
    else {
      this.setState({ endOflistNahiHua: false })
    }
  }

  handleLogout = async () => {
    await removeDataFromLocal('user')
    this.props.navigation.navigate('Auth')
  }

  render() {
    if (typeof (this.state.currentUser.id) === 'undefined') {
      return null
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
            onEndReached={() => this.loadNextPage()}
            data={this.state.posts}
            keyExtractor={(item, index) => item.id}
            ListFooterComponent={
              this.state.endOflistNahiHua
                ? <ActivityIndicator size="large" color="#0000ff" />
                : null
            }
            renderItem={({ item }) =>
              <PostCard
                currentUser={this.state.currentUser}
                nav={this.props.navigation}
                singlePost={item}
              />}
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
    const foundUserId = foundUser.id
    axios.get(`http://localhost:3000/users/${foundUserId}`)
      .then(foundUser =>
        this.setState({
          currentUser: foundUser.data
        })
      )
      .catch(err => alert(err))
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