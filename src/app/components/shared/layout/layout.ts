import { Component, Input, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Navbar } from '../navbar/navbar';

@Component({
    selector: 'app-layout',
    imports: [CommonModule, Navbar, RouterModule],
    templateUrl: './layout.html',
    styleUrl: './layout.css',
})
export class Layout implements OnInit {
    @Input() pageTitle: string = '';
    @Input() pageDescription: string = '';
    @Input() showRefreshButton: boolean = true;
    @Input() showAddButton: boolean = false;
    @Input() addButtonText: string = 'Add';
    @Input() addButtonIcon: string = 'pi-plus';

    @Output() refreshClicked = new EventEmitter<void>();
    @Output() addClicked = new EventEmitter<void>();

    @ViewChild(Navbar) navbarComponent!: Navbar;

    constructor(public authService: AuthService) { }

    ngOnInit(): void { }

    toggleMobileMenu(): void {
        // Delegate to navbar component
        if (this.navbarComponent) {
            this.navbarComponent.toggleMobileMenu();
        }
    }

    onRefresh(): void {
        this.refreshClicked.emit();
    }

    onAdd(): void {
        this.addClicked.emit();
    }
}