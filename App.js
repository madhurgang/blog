import { createStackNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation'
import AddNewPost from './screens/AddNewPost';
import Core from './Core';
import Auth from './Auth';
import Author from './screens/Author';

const AppNavigator = createStackNavigator({
  Core: Core,
  NewPost: AddNewPost,
  Author: Author
})

const SwitchNav = createSwitchNavigator({
  Auth: Auth,
  Home: AppNavigator
})

export default createAppContainer(SwitchNav)
