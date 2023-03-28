import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DarkModeService } from '@app/services/dark-mode.service';
import { SocketService } from '@app/services/socket.service';
import { PlayerInfo } from '@common/player-info';

@Component({
    selector: 'app-limited-waiting-room-page',
    templateUrl: './limited-waiting-room-page.component.html',
    styleUrls: ['./limited-waiting-room-page.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default,
})
export class LimitedWaitingRoomPageComponent implements OnInit, OnDestroy {
    protected waitingList: PlayerInfo[];

    // eslint-disable-next-line max-params
    constructor(public darkModeService: DarkModeService, private socketService: SocketService, private router: Router) {
        this.waitingList = [];
    }

    ngOnInit(): void {
        if (!this.socketService.isSocketAlive()) {
            this.router.navigate(['home']);
            return;
        }
    }

    ngOnDestroy(): void {
        if (!this.socketService.isSocketAlive()) {
            return;
        }
        this.socketService.unsubscribeLimitedWaitingRoomEvents();
        this.socketService.unsubscribeLimitedGameEvents();
    }

    protected returnToHome(): void {
        this.socketService.limitedSearchCancelled();
        this.router.navigate(['home']);
    }
}
