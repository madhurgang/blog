import React from 'react'
import { View, ActivityIndicator, FlatList } from 'react-native'
import { Button } from 'react-native-paper';
import axios from 'axios'
import PostCard from '../comp/PostCard';
import { getDataFromLocal } from '../helpers/helpers';

export default class Author extends React.Component {

  static navigationOptions = ({ navigation }) => {
    return { headerTitle: navigation.state.params.authorName + "'s posts" }
  }

  state = {
    authorId: null,
    posts: [],
    currentUser: {}
  }

  fetchAuthorPosts = () => {
    const url = `http://localhost:3000/posts?&author=${this.state.authorId}`
    axios.get(url)
      .then(res => {
        this.setState({
          posts: [...this.state.posts, ...res.data]
        }, () => console.log('successfully'))
      })
      .catch(err => console.log('err:', err))
  }

  render() {
    if (this.state.posts.length < 1) {
      return null
    } else
      return (
        <View style={{ flex: 1 }}>
          <FlatList
            style={{ flex: 1 }}
            // onEndReached={() => this.loadNextPage()}
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
        </View>
      )
  }

  componentDidMount = async () => {
    const authorId = await this.props.navigation.state.params.authorId
    const foundUser = await getDataFromLocal('user')
    this.setState({
      authorId: authorId,
      currentUser: foundUser
    }, () => this.fetchAuthorPosts())
  }
}