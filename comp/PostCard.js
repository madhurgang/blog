import React from 'react'
import { Card, Title, Paragraph } from 'react-native-paper'
import { Ionicons } from '@expo/vector-icons';
import { Text } from 'react-native'
import axios from 'axios'

export default class PostCard extends React.Component {

  state = {
    liked: false,
    authorInfo: {}
  }

  checkIfLiked = (postId, currentUserPostLikeList) => {
    return currentUserPostLikeList.includes(postId)
  }

  fetchAuthor = (authorId) => {
    const url = `http://localhost:3000/users/${authorId}`
    axios.get(url).then(
      res => this.setState({
        authorInfo: res.data
      })
    ).catch(err => console.log('err:', err))
  }

  likeUnlike = () => {
    if (this.state.liked) {
      const currentUser = this.props.currentUser
      const likedArray = currentUser.postsLikes
      const newPostLikes = likedArray.filter(item => item !== this.props.singlePost.id)
      const changedUserObj = { ...currentUser, postsLikes: newPostLikes }
      this.setState({
        liked: false
      },
        () => {
          const url = `http://localhost:3000/users/${currentUser.id}`
          axios.patch(url, changedUserObj).then(
            res => console.log('res:', res)
          ).catch(err => console.log('err:', err))
        })
    }
    if (!this.state.liked) {
      const currentUser = this.props.currentUser
      const likedArray = currentUser.postsLikes
      const newPostLikes = [...likedArray, this.props.singlePost.id]
      const changedUserObj = { ...currentUser, postsLikes: newPostLikes }
      this.setState({
        liked: true
      },
        () => {
          const url = `http://localhost:3000/users/${currentUser.id}`
          axios.patch(url, changedUserObj).then(
            res => console.log('res:', res)
          ).catch(err => console.log('err:', err))
        })
    }
    // 1 -> change state to not like
    // 2 -> call database to remove the id from liked posts

  }

  render() {
    if (this.props.currentUser.username && this.state.authorInfo.username)
      return (
        <Card>
          <Card.Content>
            <Title>{this.props.singlePost.title}</Title>
            <Paragraph>Created By: {this.state.authorInfo.username}</Paragraph>
          </Card.Content>
          <Card.Cover source={{ uri: this.props.singlePost.image }} />
          <Card.Content>
            <Paragraph>{this.props.singlePost.desc}</Paragraph>
          </Card.Content>
          <Card.Actions>
            <Ionicons name="ios-heart" size={32} color={this.state.liked === true ? 'red' : 'grey'}
              onPress={() => this.likeUnlike()} />
          </Card.Actions>
        </Card>
      )
    else
      return <Text>Loading Post...</Text>
  }

  componentDidMount = async () => {
    this.setState({
      liked: this.checkIfLiked(this.props.singlePost.id, this.props.currentUser.postsLikes)
    })
    this.fetchAuthor(this.props.singlePost.author)
  }
}