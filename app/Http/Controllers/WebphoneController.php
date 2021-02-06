<?php

namespace App\Http\Controllers;

use App\Models\Webphone;
use Illuminate\Http\Request;

class WebphoneController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return view('dashboard.webphones.browse');
    }

    /**
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        return view('dashboard.webphones.edit-add');
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $this->validate(request(), [
            'name'      => 'required|max:150',
            'callerId' => 'required|numeric|digits_between:1,20'
        ]);

        /**validation successfull , create webphone */
        $webphone           = new Webphone;
        $webphone->name     = $request->name;
        $webphone->callerId = $request->callerId;
        $webphone->status   = $request->status;
        $webphone->save();

        return redirect()->route('webphones.index');
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
        return view('dashboard.webphones.edit-add', [
            'webphone' => Webphone::findOrFail($id)
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $this->validate(request(), [
            'name'      => 'required|max:150',
            'callerId' => 'required|numeric|digits_between:1,20'
        ]);

        /**validation successfull , create webphone */
        $webphone           = Webphone::findOrFail($id);
        $webphone->name     = $request->name;
        $webphone->callerId = $request->callerId;
        $webphone->status   = $request->status;
        $webphone->save();

        return redirect()->route('webphones.index');
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        try {
            $webphone = Webphone::findOrFail($id);
            $webphone->delete();
            return response()->json([
                'message' => 'Webphone Removed Successfully!' , 
            ] , 200);
        } catch (\Throwable $th) {
            return response()->json([
                'message' => 'Failed to remove!' , 
                'error' => $th->getMessage()
            ] , 500);
        }
    }
}
