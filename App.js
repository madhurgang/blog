import React from 'react';
import { Button, Card, Title, Paragraph, Appbar, FAB } from 'react-native-paper'
import { View, Text, FlatList, StyleSheet } from 'react-native'
import axios from 'axios'

const PostCard = (props) => {
  return (
    <Card>
      <Card.Content>
        <Title>Author ka naam</Title>
      </Card.Content>
      <Card.Cover source={{ uri: props.singlePost.image }} />
      <Card.Content>
        <Paragraph>{props.singlePost.desc}</Paragraph>
      </Card.Content>
      <Card.Actions>
        <Button icon="thumb-up" color='green'>2</Button>
        <Button icon="thumb-down" color='red'>0</Button>
      </Card.Actions>
    </Card>
  )
}

export default class App extends React.Component {

  state = {
    posts: []
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Appbar>
          <Appbar.Header><Text style={{ color: 'white' }}>My Special Blog</Text></Appbar.Header>
        </Appbar>

        <FlatList
          style={{ flex: 1 }}
          data={this.state.posts}
          keyExtractor={(item, index) => item.id}
          renderItem={({ item }) => <PostCard singlePost={item} />}
        />

        <FAB
          small
          style={styles.fab}
          icon="add"
          onPress={() => console.log('Pressed')}
        />

      </View>
    );
  }

  componentDidMount = () => {
    const url = 'http://localhost:3000/posts'
    axios.get(url)
      .then(res => {
        this.setState({
          posts: res.data
        })
      })
      .catch(err => console.log('err:', err))
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