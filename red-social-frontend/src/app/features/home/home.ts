import { Component } from '@angular/core';
import { Posts } from '../../shared/components/posts/posts';
import { CreatePosts } from "../../shared/components/create-posts/create-posts";

@Component({
  selector: 'app-home',
  imports: [Posts, CreatePosts],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {

  

}
