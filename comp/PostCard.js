import React from 'react'
import { Card, Title, Paragraph } from 'react-native-paper'
import { Ionicons } from '@expo/vector-icons';

export default class PostCard extends React.Component {

  state = {
    liked: true
  }

  checkIfLiked = (postId, currentUserPostLikeList) => {
    return currentUserPostLikeList.includes(postId)
  }

  render() {
    if (this.props.currentUser.username)
      return (
        <Card>
          <Card.Content>
            <Title>{this.props.currentUser.username}</Title>
          </Card.Content>
          <Card.Cover source={{ uri: this.props.singlePost.image }} />
          <Card.Content>
            <Paragraph>{this.props.singlePost.desc}</Paragraph>
          </Card.Content>
          <Card.Actions>
            <Ionicons name="ios-heart" size={32} color={this.state.liked === true ? 'red' : 'grey'}
              onPress={() => alert('like')} />
          </Card.Actions>
        </Card>
      )
    else
      return null
  }

  componentDidMount = () => {
    this.setState({
      liked: this.checkIfLiked(this.props.singlePost.id, this.props.currentUser.postsLikes)
    })
  }
}