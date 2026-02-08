import { AfterViewInit, Component, CUSTOM_ELEMENTS_SCHEMA, effect, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MatchDetailService } from '../../services/match-detail-service';

import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-match-results',
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './match-results.html',
  styleUrl: './match-results.css',
})
export class MatchResults implements OnInit {
  private matchResultsService = inject(MatchDetailService);
  matches = this.matchResultsService.matches;
  private platformId = inject(PLATFORM_ID);
  
  ngOnInit(): void {
    this.matchResultsService.getMatches();
  }
  
  
}
