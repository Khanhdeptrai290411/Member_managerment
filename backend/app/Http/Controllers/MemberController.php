<?php

namespace App\Http\Controllers;

use App\Models\Member;
use Illuminate\Http\Request;

class MemberController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Member::all();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:members,email',
            'phone' => 'nullable',
            'birthday' => 'nullable|date',
            'country' => 'nullable',
            'city' => 'nullable',
            'district' => 'nullable',
            'address' => 'nullable',
        ]);

        $member = Member::create($validated);
        return response()->json($member, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Member $member)
    {
       return $member;
    }   

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Member $member)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Member $member)
    {
        $validated = $request->validate([
            'name' => 'sometimes|required',
            'email' => 'sometimes|required|email|unique:members,email,' . $member->id,
            'phone' => 'nullable',
            'birthday' => 'nullable|date',
            'country' => 'nullable',
            'city' => 'nullable',
            'district' => 'nullable',
            'address' => 'nullable',    
        ]);

        $member->update($validated);
        return response()->json($member);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Member $member)
    {
        $member->delete();
        return response()->json(null, 204);
    }
}
