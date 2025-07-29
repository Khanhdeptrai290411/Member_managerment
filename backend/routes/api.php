<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MemberController;

Route::middleware('api')->group(function () {
    Route::apiResource('members', MemberController::class);
});
