import { TestBed } from '@angular/core/testing';

import { MatchDetail } from './match-detail';

describe('MatchDetail', () => {
  let service: MatchDetail;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MatchDetail);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
