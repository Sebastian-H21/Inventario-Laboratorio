<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('materials', function (Blueprint $table) {
            $table-> engine = 'innoDB';
            $table->id();
            $table->string('codigo', 10)->unique(); 
            $table->string('nombre', 30);
            $table->integer('cantidad');
            $table->string('marca', 50);
            $table->string('categoria', 30);
            $table->string('ubicacion', 30);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('materials');
    }
};
