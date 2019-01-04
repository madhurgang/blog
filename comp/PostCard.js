import React from 'react'
import { Card, Title, Paragraph } from 'react-native-paper'
import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableHighlight } from 'react-native'
import axios from 'axios'

export default class PostCard extends React.Component {

  state = {
    liked: false,
    authorInfo: {},
    likeCount: 0
  }

  checkIfLiked = (postId, currentUserPostLikeList) => {
    // console.log('postId:', postId)
    // console.log('current:', currentUserPostLikeList)
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

  getLikeCount = () => {
    this.setState({
      likeCount: this.props.singlePost.likeCount
    })
  }

  likeUnlike = () => {
    const likeStatus = this.state.liked ? -1 : 1
    // if (this.state.liked)
    //   const newPostLikes = this.props.currentUser.postsLikes.filter(item => item !== this.props.singlePost.id)
    // else
    const newPostLikes = [...this.props.currentUser.postsLikes, this.props.singlePost.id]
    const changedUserObj = { ...this.props.currentUser, postsLikes: newPostLikes }
    const changedPostObj = { ...this.props.singlePost, likeCount: parseInt(this.props.singlePost.likeCount + likeStatus) }
    this.setState({
      liked: !this.state.liked,
      likeCount: this.state.likeCount + likeStatus
    },
      () => {
        const url = `http://localhost:3000/users/${this.props.currentUser.id}`
        const url2 = `http://localhost:3000/posts/${this.props.singlePost.id}`
        axios.patch(url, changedUserObj).then(
          res => {
            axios.patch(url2, changedPostObj).then(
              res => console.log('res:', res)
            ).catch(err => console.log('err:', err))
          }
        ).catch(err => console.log('err:', err))
      })
  }

  render() {
    if (this.props.currentUser.username && this.state.authorInfo.username)
      return (
        <Card>
          <Card.Content>
            <Title>{this.props.singlePost.title}</Title>
            <TouchableHighlight underlayColor='green'
              onPress={() =>
                this.props.nav.navigate('Author', {
                  authorId: this.props.singlePost.author,
                  authorName: this.state.authorInfo.username
                }
                )}>
              <Paragraph>Created By:
                <Text style={{ color: 'grey', fontWeight: 'bold' }}>{' ' + this.state.authorInfo.username}</Text>
              </Paragraph>
            </TouchableHighlight>
            <Card.Content>
              <Paragraph>Category:
                <Text style={{ color: 'grey', fontWeight: 'bold' }}>{' ' + this.props.singlePost.category}</Text>
              </Paragraph>
            </Card.Content>
          </Card.Content>
          <Card.Cover source={{ uri: this.props.singlePost.image }} />
          <Card.Content>
            <Paragraph>{this.props.singlePost.desc}</Paragraph>
          </Card.Content>
          <Card.Actions>
            <Ionicons name="ios-heart" size={32} color={this.state.liked ? 'red' : 'grey'}
              onPress={() => this.likeUnlike()} />
            <Text style={{ fontSize: 12 }}>{' ' + this.state.likeCount}</Text>
          </Card.Actions>
        </Card>
      )
    else
      return null
  }

  componentDidMount = async () => {
    const currentLikes = await this.props.currentUser.postsLikes
    this.setState({
      liked: this.checkIfLiked(this.props.singlePost.id, currentLikes)
    })
    this.fetchAuthor(this.props.singlePost.author)
    this.getLikeCount()
  }
}