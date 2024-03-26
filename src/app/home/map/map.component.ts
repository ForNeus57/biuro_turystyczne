import {Component, OnInit} from '@angular/core';
import {GoogleMapsModule} from "@angular/google-maps";

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [GoogleMapsModule],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements OnInit {
  center: google.maps.LatLngLiteral = {
    lat: 50.06456555083074,
    lng: 19.923373160953815
  }
  zoom = 16
  constructor() {}
  ngOnInit(): void {
  }
}
