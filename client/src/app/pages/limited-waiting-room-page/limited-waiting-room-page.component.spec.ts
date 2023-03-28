/* eslint-disable max-lines */
/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line max-classes-per-file
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UrlSerializer, ChildrenOutletContexts, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { NameInputDialogComponent } from '@app/components/name-input-dialog/name-input-dialog.component';
import { AppMaterialModule } from '@app/modules/material.module';
import { GameHandlerService } from '@app/services/game-handler.service';
import { GameRequestsService } from '@app/services/game-requests.service';
import { SocketService } from '@app/services/socket.service';

import { LimitedWaitingRoomPageComponent } from './limited-waiting-room-page.component';

@Injectable({
    providedIn: 'root',
})
class MockSocketService extends SocketService {
    on(): void {
        return;
    }
    send(): void {
        return;
    }
    isSocketAlive(): boolean {
        return true;
    }
    unsubscribeLimitedWaitingRoomEvents(): void {
        return;
    }
    unsubscribeLimitedGameEvents(): void {
        return;
    }
    limitedSearchCancelled(): void {
        return;
    }
}

@Injectable({
    providedIn: 'root',
})
class MockGameRequestsService extends GameRequestsService {
    returnToSelect(): void {
        return;
    }
    launchMultiplayerGame(): void {
        return;
    }
}

@Injectable({
    providedIn: 'root',
})
class MockGameHandlerService extends GameHandlerService {}

describe('LimitedWaitingRoomPageComponent', () => {
    let component: LimitedWaitingRoomPageComponent;
    let fixture: ComponentFixture<LimitedWaitingRoomPageComponent>;
    let socketService: SocketService;
    let socketAliveSpy: jasmine.Spy;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [LimitedWaitingRoomPageComponent, NameInputDialogComponent],
            imports: [
                HttpClientTestingModule,
                AppMaterialModule,
                CommonModule,
                BrowserAnimationsModule,
                RouterTestingModule,
                FormsModule,
                ReactiveFormsModule,
            ],
            providers: [
                { provide: SocketService, useClass: MockSocketService },
                {
                    provide: GameRequestsService,
                    useClass: MockGameRequestsService,
                    import: CommonModule,
                },
                {
                    provide: GameHandlerService,
                    useClass: MockGameHandlerService,
                    import: CommonModule,
                },
                UrlSerializer,
                ChildrenOutletContexts,
            ],
        }).compileComponents();

        socketService = TestBed.inject(SocketService);
        fixture = TestBed.createComponent(LimitedWaitingRoomPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        socketAliveSpy = spyOn(socketService, 'isSocketAlive').and.returnValue(false);
    });

    it('should create', () => {
        socketAliveSpy.and.returnValue(true);
        expect(component).toBeTruthy();
        socketAliveSpy.and.returnValue(false);
    });

    afterEach(() => {
        fixture.destroy();
    });

    describe('constructor', () => {
        it('should initialize the waitingList', () => {
            expect(component['waitingList']).toEqual([]);
        });
    });

    describe('ngOnInit', () => {
        it('should not do anything if socket alive', () => {
            socketAliveSpy.and.returnValue(true);
            const spy = spyOn(Router.prototype, 'navigate');

            component.ngOnInit();
            expect(spy).not.toHaveBeenCalled();
        });
        it('should call returnToSelect on GameRequestService if socket not alive', () => {
            const spy = spyOn(Router.prototype, 'navigate');

            component.ngOnInit();
            expect(spy).toHaveBeenCalled();
        });
    });

    describe('ngOnDestroy', () => {
        it('should not do anything if socket not alive', () => {
            const spy = spyOn(socketService, 'unsubscribeLimitedWaitingRoomEvents');

            component.ngOnDestroy();
            expect(spy).not.toHaveBeenCalled();
        });
        it('should not do anything if socket not alive', () => {
            socketAliveSpy.and.returnValue(true);
            const spy = spyOn(socketService, 'unsubscribeLimitedWaitingRoomEvents');

            component.ngOnDestroy();
            expect(spy).toHaveBeenCalled();
        });
        it('should not do anything if socket not alive', () => {
            socketAliveSpy.and.returnValue(true);
            const spy = spyOn(socketService, 'unsubscribeLimitedGameEvents');

            component.ngOnDestroy();
            expect(spy).toHaveBeenCalled();
        });
    });

    describe('returnToHome', () => {
        it('should call limitedSearchCancelled on socketService', () => {
            const spy = spyOn(socketService, 'limitedSearchCancelled');

            component['returnToHome']();
            expect(spy).toHaveBeenCalled();
        });
        it('should navigate back to home', () => {
            const spy = spyOn(component['router'], 'navigate');

            component['returnToHome']();
            expect(spy).toHaveBeenCalledWith(['home']);
        });
    });

    afterEach(() => {
        fixture.destroy();
    });
});
